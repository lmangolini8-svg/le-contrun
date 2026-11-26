using UnrealBuildTool;

public class ContrunPrototypeEditorTarget : TargetRules
{
    public ContrunPrototypeEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V6;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_7;
        ExtraModuleNames.Add("ContrunPrototype");
    }
}
