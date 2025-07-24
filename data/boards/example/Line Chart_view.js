
reactCard(`
  function Widget(props) {
    const aspect = useCardAspectRatio('${data.domId}')
    return (
      <View className="no-drag">
        <LineChart
          colors={chartColors}
          color={chartColors[2]}
          title={"players score"}
          id={"linechart"}
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
        