

reactCard(`
  function Widget(props) {
    const aspect = useCardAspectRatio('${data.domId}')
    return (
          <View className="no-drag">
            <PieChart
              colors={chartColors}
              title={"players score"}
              id={"piechart"}
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



            