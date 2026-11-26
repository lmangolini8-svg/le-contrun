#pragma once

#include "GameFramework/HUD.h"
#include "ContrunHUD.generated.h"

UCLASS()
class CONTRUNPROTOTYPE_API AContrunHUD : public AHUD
{
    GENERATED_BODY()

public:
    virtual void DrawHUD() override;
};
