#include "ContrunCharacter.h"

#include "Animation/AnimSequence.h"
#include "Animation/AnimSingleNodeInstance.h"
#include "Camera/CameraComponent.h"
#include "Components/AudioComponent.h"
#include "Components/CapsuleComponent.h"
#include "Components/InputComponent.h"
#include "Components/SkeletalMeshComponent.h"
#include "Components/StaticMeshComponent.h"
#include "Engine/SkeletalMesh.h"
#include "Engine/StaticMesh.h"
#include "Engine/World.h"
#include "EngineUtils.h"
#include "GameFramework/CharacterMovementComponent.h"
#include "GameFramework/PlayerController.h"
#include "GameFramework/SpringArmComponent.h"
#include "InputCoreTypes.h"
#include "Kismet/GameplayStatics.h"
#include "Math/RotationMatrix.h"
#include "Sound/SoundBase.h"
#include "UObject/ConstructorHelpers.h"

#define LOCTEXT_NAMESPACE "ContrunPrototype"

DEFINE_LOG_CATEGORY_STATIC(LogContrunPrototype, Log, All);

namespace
{
    constexpr float WalkSpeed = 220.0f;
    constexpr float SprintSpeed = 390.0f;
    constexpr float InteractionReach = 210.0f;
    constexpr float InteractionHeight = 125.0f;

    const FName AtlasStartTag(TEXT("AtlasStart"));
    const FName WorkshopEntryTag(TEXT("AtelierEntree"));
    const FName WorkshopArrivalTag(TEXT("AtelierInterieur"));
    const FName WorkshopExitTag(TEXT("AtelierSortie"));
    const FName AnselmeTag(TEXT("Anselme"));

    const FText& OpeningLine(int32 Index)
    {
        static const FText Lines[] = {
            LOCTEXT("Opening1", "Te voilà, Aliénor. Dépose ton sac près de la porte."),
            LOCTEXT("Opening2", "La presse attend. La prochaine épreuve sera pour les Drapiers."),
            LOCTEXT("Opening3", "Regagne la rue par la même porte. La ville s’éveille.")
        };
        check(Index >= 0 && Index < UE_ARRAY_COUNT(Lines));
        return Lines[Index];
    }

    constexpr int32 OpeningLineCount = 3;
}

AContrunCharacter::AContrunCharacter()
{
    PrimaryActorTick.bCanEverTick = true;
    GetCapsuleComponent()->InitCapsuleSize(34.0f, 88.0f);
    bUseControllerRotationPitch = false;
    bUseControllerRotationYaw = false;
    bUseControllerRotationRoll = false;

    UCharacterMovementComponent* Movement = GetCharacterMovement();
    Movement->bOrientRotationToMovement = true;
    Movement->RotationRate = FRotator(0.0f, 540.0f, 0.0f);
    Movement->MaxWalkSpeed = WalkSpeed;
    Movement->MaxAcceleration = 1200.0f;
    Movement->BrakingDecelerationWalking = 1450.0f;
    Movement->MaxStepHeight = 38.0f;
    Movement->SetWalkableFloorAngle(46.0f);

    CameraBoom = CreateDefaultSubobject<USpringArmComponent>(TEXT("CameraBoom"));
    CameraBoom->SetupAttachment(GetCapsuleComponent());
    CameraBoom->TargetArmLength = 365.0f;
    CameraBoom->TargetOffset = FVector(0.0f, 0.0f, 55.0f);
    CameraBoom->SocketOffset = FVector(0.0f, 42.0f, 0.0f);
    CameraBoom->ProbeSize = 14.0f;
    CameraBoom->bUsePawnControlRotation = true;
    CameraBoom->bDoCollisionTest = true;

    FollowCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("FollowCamera"));
    FollowCamera->SetupAttachment(CameraBoom, USpringArmComponent::SocketName);
    FollowCamera->SetFieldOfView(70.0f);

    // These built-in shapes keep failed imports visible during map validation.
    FallbackBody = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("FallbackBody"));
    FallbackBody->SetupAttachment(GetCapsuleComponent());
    FallbackBody->SetRelativeLocation(FVector(0.0f, 0.0f, -32.0f));
    FallbackBody->SetRelativeScale3D(FVector(0.43f, 0.32f, 1.10f));
    FallbackBody->SetCollisionEnabled(ECollisionEnabled::NoCollision);

    FallbackHead = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("FallbackHead"));
    FallbackHead->SetupAttachment(GetCapsuleComponent());
    FallbackHead->SetRelativeLocation(FVector(0.0f, 0.0f, 45.0f));
    FallbackHead->SetRelativeScale3D(FVector(0.24f, 0.21f, 0.28f));
    FallbackHead->SetCollisionEnabled(ECollisionEnabled::NoCollision);

    static ConstructorHelpers::FObjectFinder<UStaticMesh> Cylinder(TEXT("/Engine/BasicShapes/Cylinder.Cylinder"));
    static ConstructorHelpers::FObjectFinder<UStaticMesh> Sphere(TEXT("/Engine/BasicShapes/Sphere.Sphere"));
    if (Cylinder.Succeeded())
    {
        FallbackBody->SetStaticMesh(Cylinder.Object);
    }
    if (Sphere.Succeeded())
    {
        FallbackHead->SetStaticMesh(Sphere.Object);
    }

    AlienorMesh = TSoftObjectPtr<USkeletalMesh>(FSoftObjectPath(TEXT("/Game/Sarlande/Personnages/Alienor/SK_Alienor.SK_Alienor")));
    AlienorIdle = TSoftObjectPtr<UAnimSequence>(FSoftObjectPath(TEXT("/Game/Sarlande/Personnages/Alienor/A_Alienor_Idle.A_Alienor_Idle")));
    AlienorWalk = TSoftObjectPtr<UAnimSequence>(FSoftObjectPath(TEXT("/Game/Sarlande/Personnages/Alienor/A_Alienor_Walk.A_Alienor_Walk")));

    RuelleAmbience = CreateDefaultSubobject<UAudioComponent>(TEXT("RuelleAmbience"));
    RuelleAmbience->SetupAttachment(GetCapsuleComponent());
    RuelleAmbience->SetAutoActivate(false);
    RuelleAmbience->bAllowSpatialization = false;

    AtelierAmbience = CreateDefaultSubobject<UAudioComponent>(TEXT("AtelierAmbience"));
    AtelierAmbience->SetupAttachment(GetCapsuleComponent());
    AtelierAmbience->SetAutoActivate(false);
    AtelierAmbience->bAllowSpatialization = false;
}

void AContrunCharacter::BeginPlay()
{
    Super::BeginPlay();
    FindAnchors();
    LoadAppearance();
    LoadAudio();
    if (AtlasStart.IsValid() && !PlaceAtAnchor(AtlasStart.Get()))
    {
        UE_LOG(LogContrunPrototype, Warning, TEXT("AtlasStart is blocked; keeping PlayerStart."));
    }
}

void AContrunCharacter::PawnClientRestart()
{
    Super::PawnClientRestart();
    if (APlayerController* Player = Cast<APlayerController>(Controller))
    {
        FInputModeGameOnly InputMode;
        Player->SetInputMode(InputMode);
        Player->bShowMouseCursor = false;
        Player->SetControlRotation(FRotator(-10.0f, GetActorRotation().Yaw, 0.0f));
    }
}

void AContrunCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);
    PlayerInputComponent->BindAxisKey(EKeys::MouseX, this, &AContrunCharacter::Turn);
    PlayerInputComponent->BindAxisKey(EKeys::MouseY, this, &AContrunCharacter::LookUp);
    PlayerInputComponent->BindKey(EKeys::E, IE_Pressed, this, &AContrunCharacter::Interact);
    PlayerInputComponent->BindKey(EKeys::Escape, IE_Pressed, this, &AContrunCharacter::DismissDialogue);
}

void AContrunCharacter::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);
    UpdateMovement();
    UpdateAnimation();
    UpdateAmbience();
}

void AContrunCharacter::FindAnchors()
{
    for (TActorIterator<AActor> It(GetWorld()); It; ++It)
    {
        AActor* Actor = *It;
        if (!AtlasStart.IsValid() && Actor->ActorHasTag(AtlasStartTag))
        {
            AtlasStart = Actor;
        }
        if (!WorkshopEntry.IsValid() && Actor->ActorHasTag(WorkshopEntryTag))
        {
            WorkshopEntry = Actor;
        }
        if (!WorkshopArrival.IsValid() && Actor->ActorHasTag(WorkshopArrivalTag))
        {
            WorkshopArrival = Actor;
        }
        if (!WorkshopExit.IsValid() && Actor->ActorHasTag(WorkshopExitTag))
        {
            WorkshopExit = Actor;
        }
        if (!Anselme.IsValid() && Actor->ActorHasTag(AnselmeTag))
        {
            Anselme = Actor;
        }
    }
    if (!AtlasStart.IsValid() || !WorkshopEntry.IsValid() || !WorkshopArrival.IsValid() || !WorkshopExit.IsValid() || !Anselme.IsValid())
    {
        UE_LOG(LogContrunPrototype, Error, TEXT("The map must provide AtlasStart, AtelierEntree, AtelierInterieur, AtelierSortie and Anselme actor tags."));
    }
}

void AContrunCharacter::LoadAppearance()
{
    USkeletalMesh* Mesh = AlienorMesh.LoadSynchronous();
    if (!Mesh)
    {
        Notice = LOCTEXT("MissingMesh", "Le modèle d’Aliénor n’a pas été chargé.");
        NoticeUntil = GetWorld()->GetTimeSeconds() + 10.0;
        UE_LOG(LogContrunPrototype, Error, TEXT("Alienor skeletal mesh missing: %s"), *AlienorMesh.ToString());
        return;
    }

    GetMesh()->SetSkeletalMesh(Mesh);
    GetMesh()->SetRelativeLocation(FVector(0.0f, 0.0f, -GetCapsuleComponent()->GetUnscaledCapsuleHalfHeight()));
    GetMesh()->SetRelativeRotation(FRotator(0.0f, AlienorMeshYaw, 0.0f));
    FallbackHead->SetHiddenInGame(true);
    FallbackBody->SetHiddenInGame(true);

    IdleAnimation = AlienorIdle.LoadSynchronous();
    WalkAnimation = AlienorWalk.LoadSynchronous();
    if (!IdleAnimation || !WalkAnimation)
    {
        UE_LOG(LogContrunPrototype, Warning, TEXT("Load both Alienor animation sequences for idle and walk."));
    }
    UpdateAnimation();
}

void AContrunCharacter::LoadAudio()
{
    RuelleAmbience->SetSound(LoadObject<USoundBase>(nullptr, TEXT("/Game/Sarlande/Audio/Amb_Ruelle.Amb_Ruelle")));
    AtelierAmbience->SetSound(LoadObject<USoundBase>(nullptr, TEXT("/Game/Sarlande/Audio/Amb_Atelier.Amb_Atelier")));
    DoorSound = LoadObject<USoundBase>(nullptr, TEXT("/Game/Sarlande/Audio/SFX_Porte.SFX_Porte"));
    PressSound = LoadObject<USoundBase>(nullptr, TEXT("/Game/Sarlande/Audio/SFX_Presse.SFX_Presse"));
}

void AContrunCharacter::UpdateAmbience()
{
    UAudioComponent* Active = bInsideWorkshop ? AtelierAmbience.Get() : RuelleAmbience.Get();
    if (Active->Sound && !Active->IsPlaying())
    {
        Active->FadeIn(0.2f, 0.26f);
    }
}

void AContrunCharacter::ChangeAmbience()
{
    UAudioComponent* Previous = bInsideWorkshop ? RuelleAmbience.Get() : AtelierAmbience.Get();
    if (Previous->IsPlaying())
    {
        Previous->FadeOut(0.2f, 0.0f);
    }
    UpdateAmbience();
    if (DoorSound)
    {
        UGameplayStatics::PlaySound2D(this, DoorSound, 0.55f);
    }
}

void AContrunCharacter::UpdateMovement()
{
    APlayerController* Player = Cast<APlayerController>(Controller);
    if (!Player || !Player->IsLocalController() || DialogueIndex != INDEX_NONE)
    {
        return;
    }

    const bool Forward = Player->IsInputKeyDown(EKeys::W) || Player->IsInputKeyDown(EKeys::Z) || Player->IsInputKeyDown(EKeys::Up);
    const bool Backward = Player->IsInputKeyDown(EKeys::S) || Player->IsInputKeyDown(EKeys::Down);
    const bool Left = Player->IsInputKeyDown(EKeys::A) || Player->IsInputKeyDown(EKeys::Q) || Player->IsInputKeyDown(EKeys::Left);
    const bool Right = Player->IsInputKeyDown(EKeys::D) || Player->IsInputKeyDown(EKeys::Right);
    const bool Sprint = Player->IsInputKeyDown(EKeys::LeftShift) || Player->IsInputKeyDown(EKeys::RightShift);
    GetCharacterMovement()->MaxWalkSpeed = Sprint ? SprintSpeed : WalkSpeed;

    const FVector2D Axes(static_cast<int32>(Forward) - static_cast<int32>(Backward),
                        static_cast<int32>(Right) - static_cast<int32>(Left));
    if (!Axes.IsNearlyZero())
    {
        const FVector2D Direction = Axes.GetSafeNormal();
        const FRotationMatrix View(FRotator(0.0f, Player->GetControlRotation().Yaw, 0.0f));
        AddMovementInput(View.GetUnitAxis(EAxis::X), Direction.X);
        AddMovementInput(View.GetUnitAxis(EAxis::Y), Direction.Y);
    }
}

void AContrunCharacter::UpdateAnimation()
{
    const float Speed = static_cast<float>(GetVelocity().Size2D());
    UAnimSequence* Desired = Speed > 10.0f && WalkAnimation ? WalkAnimation.Get() : IdleAnimation.Get();
    if (Desired && CurrentAnimation.Get() != Desired)
    {
        CurrentAnimation = Desired;
        GetMesh()->PlayAnimation(Desired, true);
    }
    if (UAnimSingleNodeInstance* Instance = GetMesh()->GetSingleNodeInstance())
    {
        const float PlayRate = Desired && Desired == WalkAnimation.Get()
            ? FMath::Clamp(Speed / WalkSpeed, 0.65f, 1.75f) : 1.0f;
        Instance->SetPlayRate(PlayRate);
    }
}

void AContrunCharacter::Turn(float Value)
{
    if (DialogueIndex == INDEX_NONE)
    {
        AddControllerYawInput(Value);
    }
}

void AContrunCharacter::LookUp(float Value)
{
    if (DialogueIndex == INDEX_NONE)
    {
        AddControllerPitchInput(-Value);
    }
}

bool AContrunCharacter::PlaceAtAnchor(const AActor* Anchor)
{
    if (!IsValid(Anchor))
    {
        return false;
    }

    FVector Ground = Anchor->GetActorLocation();
    FCollisionQueryParams Params(SCENE_QUERY_STAT(ContrunGround), false, this);
    Params.AddIgnoredActor(Anchor);
    FHitResult Hit;
    if (GetWorld()->LineTraceSingleByChannel(Hit, Ground + FVector(0.0f, 0.0f, 75.0f),
            Ground - FVector(0.0f, 0.0f, 125.0f), ECC_Visibility, Params) && Hit.Normal.Z > 0.65f)
    {
        Ground.Z = Hit.ImpactPoint.Z;
    }

    const FVector Center = Ground + FVector(0.0f, 0.0f, GetCapsuleComponent()->GetScaledCapsuleHalfHeight() + 2.0f);
    const FRotator Facing(0.0f, Anchor->GetActorRotation().Yaw, 0.0f);
    if (!TeleportTo(Center, Facing))
    {
        return false;
    }

    GetCharacterMovement()->StopMovementImmediately();
    if (Controller)
    {
        Controller->SetControlRotation(FRotator(-10.0f, Facing.Yaw, 0.0f));
    }
    return true;
}

bool AContrunCharacter::IsNear(const AActor* Anchor) const
{
    if (!IsValid(Anchor))
    {
        return false;
    }
    const FVector Difference = GetActorLocation() - Anchor->GetActorLocation();
    return Difference.SizeSquared2D() <= FMath::Square(InteractionReach)
        && FMath::Abs(Difference.Z - GetCapsuleComponent()->GetScaledCapsuleHalfHeight()) <= InteractionHeight;
}

AContrunCharacter::EInteraction AContrunCharacter::FindInteraction() const
{
    if (!bInsideWorkshop)
    {
        return IsNear(WorkshopEntry.Get()) && WorkshopArrival.IsValid() ? EInteraction::Enter : EInteraction::None;
    }

    const bool NearAnselme = IsNear(Anselme.Get());
    const bool NearExit = IsNear(WorkshopExit.Get()) && WorkshopEntry.IsValid();
    if (NearAnselme && (!NearExit || FVector::DistSquared2D(GetActorLocation(), Anselme->GetActorLocation())
        < FVector::DistSquared2D(GetActorLocation(), WorkshopExit->GetActorLocation())))
    {
        return EInteraction::Talk;
    }
    return NearExit ? EInteraction::Exit : EInteraction::None;
}

void AContrunCharacter::Interact()
{
    if (DialogueIndex != INDEX_NONE)
    {
        if (++DialogueIndex >= (bMetAnselme ? 1 : OpeningLineCount))
        {
            bMetAnselme = true;
            DismissDialogue();
        }
        else if (DialogueIndex == 1 && PressSound && Anselme.IsValid())
        {
            UGameplayStatics::PlaySoundAtLocation(this, PressSound, Anselme->GetActorLocation(),
                FRotator::ZeroRotator, 0.45f);
        }
        return;
    }

    switch (FindInteraction())
    {
    case EInteraction::Enter:
        if (PlaceAtAnchor(WorkshopArrival.Get()))
        {
            bInsideWorkshop = true;
            ChangeAmbience();
            return;
        }
        break;
    case EInteraction::Exit:
        if (PlaceAtAnchor(WorkshopEntry.Get()))
        {
            bInsideWorkshop = false;
            bReturnedToAtlas = bMetAnselme;
            ChangeAmbience();
            return;
        }
        break;
    case EInteraction::Talk:
        DialogueIndex = 0;
        GetCharacterMovement()->StopMovementImmediately();
        return;
    case EInteraction::None:
        return;
    }
    Notice = LOCTEXT("Blocked", "Le passage est bloqué.");
    NoticeUntil = GetWorld()->GetTimeSeconds() + 3.0;
}

void AContrunCharacter::DismissDialogue()
{
    DialogueIndex = INDEX_NONE;
}

FText AContrunCharacter::GetInteractionPrompt() const
{
    if (DialogueIndex != INDEX_NONE)
    {
        return LOCTEXT("Continue", "Continuer");
    }
    switch (FindInteraction())
    {
    case EInteraction::Enter: return LOCTEXT("Enter", "Entrer dans l’imprimerie");
    case EInteraction::Talk: return LOCTEXT("Talk", "Parler à maître Anselme");
    case EInteraction::Exit: return LOCTEXT("Exit", "Ressortir dans la rue");
    default: return FText::GetEmpty();
    }
}

FText AContrunCharacter::GetDialogueLine() const
{
    if (DialogueIndex == INDEX_NONE)
    {
        return FText::GetEmpty();
    }
    return bMetAnselme ? LOCTEXT("TalkAgain", "La presse attendra. Marche un peu dans la ville.") : OpeningLine(DialogueIndex);
}

FText AContrunCharacter::GetObjectiveText() const
{
    if (!WorkshopEntry.IsValid() || !WorkshopArrival.IsValid() || !WorkshopExit.IsValid() || !Anselme.IsValid())
    {
        return LOCTEXT("IncompleteMap", "Plan incomplet : vérifier les repères de l’imprimerie.");
    }
    if (bInsideWorkshop)
    {
        return bMetAnselme ? LOCTEXT("ExitObjective", "Rejoindre la rue par la même porte")
            : LOCTEXT("AnselmeObjective", "Retrouver maître Anselme");
    }
    if (bReturnedToAtlas)
    {
        return LOCTEXT("ReturnObjective", "Retour au seuil de l’imprimerie");
    }
    return LOCTEXT("EnterObjective", "Rejoindre l’imprimerie d’Anselme");
}

FText AContrunCharacter::GetNoticeText() const
{
    return GetWorld()->GetTimeSeconds() < NoticeUntil ? Notice : FText::GetEmpty();
}

AActor* AContrunCharacter::GetObjectiveAnchor() const
{
    if (bInsideWorkshop)
    {
        return bMetAnselme ? WorkshopExit.Get() : Anselme.Get();
    }
    return bReturnedToAtlas ? nullptr : WorkshopEntry.Get();
}

#undef LOCTEXT_NAMESPACE
