
// data contains: data.icon, data.color, data.name, data.params
reactCard(`
  function Widget(props) {
    const value = props.value;
    const fullHeight = true

    const content = <YStack f={fullHeight ? 1 : undefined}  mt={fullHeight ? "20px" : "0px"} ai="center" jc="center" width="100%">
        {props.icon && props.displayIcon !== false && (
            <Icon name={props.icon} size={48} color={props.color}/>
        )}
        {props.displayResponse !== false && (
            <CardValue mode="markdown" value={value ?? "Player B Ready"} />
        )}
    </YStack>

    return (
        <Tinted>
          <ProtoThemeProvider forcedTheme={window.TamaguiTheme}>
            <ActionCard data={props}>
              {props.displayButton !== false ? <ParamsForm data={props}>{content}</ParamsForm> : props.displayResponse !== false && content}
            </ActionCard>
          </ProtoThemeProvider>
        </Tinted>
    );
  }
`, data.domId, data)

