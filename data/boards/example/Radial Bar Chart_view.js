
reactCard(`
  function Widget(props) {
    const aspect = useCardAspectRatio('${data.domId}')
    return (
      <View className="no-drag">
        <RadialBarChart
          colors={chartColors}
          title={"Progress per category"}
          id={"radialbarchart"}
          data={props.value}
          dataKey={props.params.dataKey}
          nameKey={props.params.nameKey}
          isAnimationActive={false}
          startAngle={props.params.startAngle}
          endAngle={props.params.endAngle}
          displayLegend={props.params.displayLegend}
          aspect={aspect}
        />
      </View>
    );
  }
`, data.domId, data)
    