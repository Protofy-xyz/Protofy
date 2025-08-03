//@card/react

function Widget(card) {
  const value = card.value;
  return (
      <Tinted>
        <ProtoThemeProvider forcedTheme={window.TamaguiTheme}>
            <YStack f={1} height="100%" ai="center" jc="center" width="100%">
                {card.icon && card.displayIcon !== false && (
                    <Icon name={card.icon} size={48} color={card.color}/>
                )}
                {card.displayResponse !== false && (
                    <CardValue value={value ?? "N/A"} />
                )}
            </YStack>
        </ProtoThemeProvider>
      </Tinted>
  );
}
