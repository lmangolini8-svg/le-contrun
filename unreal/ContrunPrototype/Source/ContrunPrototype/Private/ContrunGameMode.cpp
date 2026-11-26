#include "ContrunGameMode.h"

#include "ContrunCharacter.h"
#include "ContrunHUD.h"

AContrunGameMode::AContrunGameMode()
{
    DefaultPawnClass = AContrunCharacter::StaticClass();
    HUDClass = AContrunHUD::StaticClass();
}
