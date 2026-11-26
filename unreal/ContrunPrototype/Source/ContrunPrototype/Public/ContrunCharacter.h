#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "UObject/SoftObjectPtr.h"
#include "ContrunCharacter.generated.h"

class UAnimSequence;
class UAudioComponent;
class UCameraComponent;
class USkeletalMesh;
class USoundBase;
class USpringArmComponent;
class UStaticMeshComponent;

UCLASS()
class CONTRUNPROTOTYPE_API AContrunCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    AContrunCharacter();
    virtual void Tick(float DeltaSeconds) override;
    virtual void PawnClientRestart() override;

    FText GetInteractionPrompt() const;
    FText GetDialogueLine() const;
    FText GetObjectiveText() const;
    FText GetNoticeText() const;
    AActor* GetObjectiveAnchor() const;

protected:
    virtual void BeginPlay() override;
    virtual void SetupPlayerInputComponent(UInputComponent* PlayerInputComponent) override;

private:
    enum class EInteraction : uint8 { None, Enter, Talk, Exit };

    void FindAnchors();
    void LoadAppearance();
    void LoadAudio();
    void UpdateMovement();
    void UpdateAnimation();
    void UpdateAmbience();
    void ChangeAmbience();
    void Turn(float Value);
    void LookUp(float Value);
    void Interact();
    void DismissDialogue();
    bool PlaceAtAnchor(const AActor* Anchor);
    EInteraction FindInteraction() const;
    bool IsNear(const AActor* Anchor) const;

    UPROPERTY(VisibleAnywhere, Category = "Camera")
    TObjectPtr<USpringArmComponent> CameraBoom;

    UPROPERTY(VisibleAnywhere, Category = "Camera")
    TObjectPtr<UCameraComponent> FollowCamera;

    UPROPERTY()
    TObjectPtr<UStaticMeshComponent> FallbackBody;

    UPROPERTY()
    TObjectPtr<UStaticMeshComponent> FallbackHead;

    UPROPERTY()
    TObjectPtr<UAudioComponent> RuelleAmbience;

    UPROPERTY()
    TObjectPtr<UAudioComponent> AtelierAmbience;

    UPROPERTY()
    TObjectPtr<USoundBase> DoorSound;

    UPROPERTY()
    TObjectPtr<USoundBase> PressSound;

    UPROPERTY(EditDefaultsOnly, Category = "Alienor")
    TSoftObjectPtr<USkeletalMesh> AlienorMesh;

    UPROPERTY(EditDefaultsOnly, Category = "Alienor")
    TSoftObjectPtr<UAnimSequence> AlienorIdle;

    UPROPERTY(EditDefaultsOnly, Category = "Alienor")
    TSoftObjectPtr<UAnimSequence> AlienorWalk;

    UPROPERTY(EditDefaultsOnly, Category = "Alienor")
    float AlienorMeshYaw = 0.0f;

    UPROPERTY()
    TObjectPtr<UAnimSequence> IdleAnimation;

    UPROPERTY()
    TObjectPtr<UAnimSequence> WalkAnimation;

    UPROPERTY()
    TObjectPtr<UAnimSequence> CurrentAnimation;

    TWeakObjectPtr<AActor> AtlasStart;
    TWeakObjectPtr<AActor> WorkshopEntry;
    TWeakObjectPtr<AActor> WorkshopArrival;
    TWeakObjectPtr<AActor> WorkshopExit;
    TWeakObjectPtr<AActor> Anselme;
    int32 DialogueIndex = INDEX_NONE;
    bool bInsideWorkshop = false;
    bool bMetAnselme = false;
    bool bReturnedToAtlas = false;
    FText Notice;
    double NoticeUntil = 0.0;
};
