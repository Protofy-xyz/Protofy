//@card/react

function Widget(card) {
  const value = card.value;
  const fullHeight = value !== undefined && typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean";

  const content = <YStack f={fullHeight ? 1 : undefined}  mt={fullHeight ? "20px" : "0px"} ai="center" jc="center" width="100%">
      {card.icon && card.displayIcon !== false && (
          <Icon name={card.icon} size={48} color={card.color}/>
      )}
      {card.displayResponse !== false && (
          <CardValue value={value ?? "N/A"} />
      )}
  </YStack>

  return (
      <Tinted>
        <ProtoThemeProvider forcedTheme={window.TamaguiTheme}>
          <ActionCard data={card}>
            {card.displayButton !== false ? <ParamsForm data={card}>{content}</ParamsForm> : card.displayResponse !== false && content}
          </ActionCard>
        </ProtoThemeProvider>
      </Tinted>
  );
}
