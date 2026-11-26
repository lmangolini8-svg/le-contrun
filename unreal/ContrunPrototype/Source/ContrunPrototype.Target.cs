using UnrealBuildTool;

public class ContrunPrototypeTarget : TargetRules
{
    public ContrunPrototypeTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V6;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_7;
        ExtraModuleNames.Add("ContrunPrototype");
    }
}
