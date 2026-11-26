#include "ContrunHUD.h"

#include "ContrunCharacter.h"
#include "Engine/Canvas.h"
#include "Engine/Engine.h"
#include "Engine/Font.h"
#include "GameFramework/PlayerController.h"

#define LOCTEXT_NAMESPACE "ContrunHUD"

namespace
{
const FLinearColor Panel(0.035f, 0.050f, 0.046f, 0.94f);
const FLinearColor Paper(0.94f, 0.91f, 0.81f);
const FLinearColor Brass(0.89f, 0.73f, 0.46f);
}

void AContrunHUD::DrawHUD()
{
    Super::DrawHUD();

    const APlayerController* Controller = GetOwningPlayerController();
    const AContrunCharacter* Character = Controller ? Cast<AContrunCharacter>(Controller->GetPawn()) : nullptr;
    if (!Canvas || !GEngine || !Character)
    {
        return;
    }

    UFont* Font = GEngine->GetMediumFont();
    if (!Font)
    {
        return;
    }

    const float Width = Canvas->ClipX;
    const float Height = Canvas->ClipY;
    if (Width <= 0.0f || Height <= 0.0f)
    {
        return;
    }

    const float Scale = FMath::Clamp(Height / 900.0f, 0.7f, 1.45f);
    const float Margin = 24.0f * Scale;
    const float Padding = 12.0f * Scale;
    const float Rule = 2.0f * Scale;
    const float UsableWidth = FMath::Max(1.0f, Width - 2.0f * Margin);
    const auto TextWidth = [this, Font](const FString& Text, const float TextScale)
    {
        float Extent = 0.0f;
        float TextHeight = 0.0f;
        GetTextSize(Text, Extent, TextHeight, Font, TextScale);
        return Extent;
    };
    const auto DrawPanel = [this, Rule](float X, float Y, float W, float H)
    {
        DrawRect(Panel, X, Y, W, H);
        DrawRect(Brass, X, Y, Rule, H);
    };
    const auto DrawLabel = [this, Font, &TextWidth, Padding](const FString& Label, float X, float Y, float W, float TextScale, FLinearColor Color)
    {
        const float LabelWidth = TextWidth(Label, TextScale);
        const float Available = FMath::Max(1.0f, W - 2.0f * Padding);
        const float Fit = LabelWidth > Available ? TextScale * Available / LabelWidth : TextScale;
        DrawText(Label, Color, X + Padding, Y, Font, Fit);
    };

    const FText Dialogue = Character->GetDialogueLine();
    const bool bDialogue = !Dialogue.IsEmpty();
    const AActor* ObjectiveAnchor = Character->GetObjectiveAnchor();
    FString Objective = Character->GetObjectiveText().ToString();
    if (!bDialogue && IsValid(ObjectiveAnchor))
    {
        const FVector AnchorLocation = ObjectiveAnchor->GetActorLocation();
        const int32 DistanceMetres = FMath::RoundToInt(FVector::Dist2D(Character->GetActorLocation(), AnchorLocation) / 100.0);
        if (DistanceMetres > 2 && !Objective.IsEmpty())
        {
            Objective = FText::Format(
                LOCTEXT("ObjectiveDistance", "{0}  ·  {1} m"),
                FText::FromString(Objective), FText::AsNumber(DistanceMetres)).ToString();
        }

        FVector2D Projected;
        const float Radius = 6.0f * Scale;
        if (DistanceMetres > 2
            && Controller->ProjectWorldLocationToScreen(AnchorLocation + FVector(0.0, 0.0, 150.0), Projected, true)
            && Projected.X >= Margin + Radius && Projected.X <= Width - Margin - Radius
            && Projected.Y >= Margin + 50.0f * Scale && Projected.Y <= Height - Margin - 50.0f * Scale)
        {
            const float X = static_cast<float>(Projected.X);
            const float Y = static_cast<float>(Projected.Y);
            const FLinearColor Backdrop(Panel.R, Panel.G, Panel.B, 0.75f);
            DrawRect(Backdrop, X - Radius, Y - Radius, 2.0f * Radius, 2.0f * Radius);
            DrawLine(X, Y - Radius, X + Radius, Y, Brass, Rule);
            DrawLine(X + Radius, Y, X, Y + Radius, Brass, Rule);
            DrawLine(X, Y + Radius, X - Radius, Y, Brass, Rule);
            DrawLine(X - Radius, Y, X, Y - Radius, Brass, Rule);
        }
    }

    if (!bDialogue && !Objective.IsEmpty())
    {
        const float CardWidth = FMath::Min(UsableWidth, TextWidth(Objective, Scale) + 2.0f * Padding + Rule);
        DrawPanel(Margin, Margin, CardWidth, 38.0f * Scale);
        DrawLabel(Objective, Margin, Margin + 8.0f * Scale, CardWidth, Scale, Paper);
    }

    if (bDialogue)
    {
        const float CardWidth = FMath::Min(UsableWidth, 650.0f * Scale);
        const float BodyWidth = FMath::Max(1.0f, CardWidth - 2.0f * Padding);
        TArray<FString> Words;
        Dialogue.ToString().ParseIntoArrayWS(Words);
        TArray<FString> Lines;
        FString Line;
        for (const FString& Word : Words)
        {
            const FString Candidate = Line.IsEmpty() ? Word : Line + TEXT(" ") + Word;
            if (!Line.IsEmpty() && TextWidth(Candidate, Scale) > BodyWidth)
            {
                Lines.Add(MoveTemp(Line));
                Line = Word;
            }
            else
            {
                Line = Candidate;
            }
        }
        if (!Line.IsEmpty())
        {
            Lines.Add(MoveTemp(Line));
        }

        const float LineHeight = 26.0f * Scale;
        const float CardHeight = 2.0f * Padding + LineHeight * (Lines.Num() + 2);
        const float X = (Width - CardWidth) * 0.5f;
        const float Y = Height - Margin - CardHeight;
        DrawPanel(X, Y, CardWidth, CardHeight);
        DrawLabel(LOCTEXT("Anselme", "Anselme").ToString(), X, Y + Padding, CardWidth, Scale, Brass);
        for (int32 Index = 0; Index < Lines.Num(); ++Index)
        {
            DrawLabel(Lines[Index], X, Y + Padding + LineHeight * (Index + 1), CardWidth, Scale, Paper);
        }
        DrawLabel(LOCTEXT("Continue", "[E]  Continuer").ToString(), X, Y + Padding + LineHeight * (Lines.Num() + 1), CardWidth, 0.9f * Scale, Brass);
        return;
    }

    const FString Interaction = Character->GetInteractionPrompt().ToString();
    const FString Notice = Character->GetNoticeText().ToString();
    float Bottom = Height - Margin;
    if (!Interaction.IsEmpty())
    {
        const FString Label = FText::Format(LOCTEXT("Interaction", "[E]  {0}"), FText::FromString(Interaction)).ToString();
        const float CardWidth = FMath::Min(UsableWidth, TextWidth(Label, Scale) + 2.0f * Padding + Rule);
        const float X = (Width - CardWidth) * 0.5f;
        const float Y = Bottom - 38.0f * Scale;
        DrawPanel(X, Y, CardWidth, 38.0f * Scale);
        DrawLabel(Label, X, Y + 8.0f * Scale, CardWidth, Scale, Brass);
        Bottom = Y - 6.0f * Scale;
    }
    if (!Notice.IsEmpty())
    {
        const float CardWidth = FMath::Min(UsableWidth, TextWidth(Notice, Scale) + 2.0f * Padding + Rule);
        const float X = (Width - CardWidth) * 0.5f;
        const float Y = Bottom - 38.0f * Scale;
        DrawPanel(X, Y, CardWidth, 38.0f * Scale);
        DrawLabel(Notice, X, Y + 8.0f * Scale, CardWidth, Scale, Paper);
    }
}

#undef LOCTEXT_NAMESPACE
