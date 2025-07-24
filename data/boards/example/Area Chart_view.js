
reactCard(`
  function Widget(props) {
    const aspect = useCardAspectRatio('${data.domId}')
    return (
      <View className="no-drag">
        <AreaChart
          colors={chartColors}
          color={chartColors[0]}
          title={"players score"}
          id={"areachart"}
          data={props.value}
          dataKey={props.params.dataKey}
          nameKey={props.params.nameKey}
          isAnimationActive={false}
          aspect={aspect}
        />
      </View>
    );
  }
`, data.domId, data)
    