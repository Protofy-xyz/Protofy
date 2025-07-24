
reactCard(`
  function Widget(props) {
    const aspect = useCardAspectRatio('${data.domId}')
    return (
      <View className="no-drag">
        <RadarChart
          colors={["#8884d8", "#82ca9d"]}
          id={"radarchart"}
          data={props.value}
          dataKey={props.params.dataKey}
          nameKey={props.params.nameKey}
          isAnimationActive={false}
          aspect={aspect}
          colors={chartColors}
          color={chartColors[1]}
        />
      </View>
    );
  }
`, data.domId, data)
    