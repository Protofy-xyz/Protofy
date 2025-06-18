
import { AutoActions, getServiceToken } from 'protonode'

export default (app, context) => {
    context.cards.add({
        group: 'charts',
        tag: 'rechart',
        name: 'pie',
        id: 'charts_recharts_pie',
        templateName: "Pie Chart",

        defaults: {
            width: 4,
            height: 8,
            name: "Pie Chart",
            icon: "chart-pie",
            description: "Displays a pie chart using Recharts",
            type: 'value',
            html: `
reactCard(\`
  function Widget() {
    const aspect = useCardAspectRatio('\${data.domId}')
    return (
          <View className="no-drag">
            <PieChart
              colors={chartColors}
              title={"players score"}
              id={"piechart"}
              data={data.value}
              dataKey={data.params.dataKey}
              nameKey={data.params.nameKey}
              isAnimationActive={false}
              aspect={aspect}
            />
          </View>
    );
  }

\`, data.domId)


            `,
            rulesCode: ``,
            params: {
                nameKey: 'name',
                dataKey: 'value'
            },
        },

        emitEvent: true,
        token: getServiceToken()
    }),
        context.cards.add({
            group: 'charts',
            tag: 'rechart',
            name: 'bar',
            id: 'charts_recharts_bar',
            templateName: "Bar Chart",

            defaults: {
                width: 4,
                height: 8,
                name: "Bar Chart",
                icon: "chart-column",
                description: "Displays a bar chart using Recharts",
                type: 'value',
                html: `
reactCard(\`
  function Widget() {
    return (
      <View className="no-drag">
        <BarChart
          colors={chartColors}
          title={"players score"}
          id={"barchart"}
          data={data.value}
          dataKey={data.params.dataKey}
          nameKey={data.params.nameKey}
          isAnimationActive={false}
        />
      </View>
    );
  }
\`, data.domId)
        `,
                params: {
                    nameKey: 'name',
                    dataKey: 'value'
                },
                rulesCode: ``
            },
            emitEvent: true,
            token: getServiceToken()
        }),
        context.cards.add({
            group: 'charts',
            tag: 'rechart',
            name: 'area',
            id: 'charts_recharts_area',
            templateName: "Area Chart",

            defaults: {
                width: 4,
                height: 8,
                name: "Area Chart",
                icon: "chart-area",
                type: 'value',
                html: `
reactCard(\`
  function Widget() {
    const aspect = useCardAspectRatio('\${data.domId}')
    return (
      <View className="no-drag">
        <AreaChart
          colors={chartColors}
          color={chartColors[0]}
          title={"players score"}
          id={"areachart"}
          data={data.value}
          dataKey={data.params.dataKey}
          nameKey={data.params.nameKey}
          isAnimationActive={false}
          aspect={aspect}
        />
      </View>
    );
  }
\`, data.domId)
    `,
                params: {
                    nameKey: 'name',
                    dataKey: 'value'
                },
                rulesCode: ``
            },
            emitEvent: true,
            token: getServiceToken()
        });
    context.cards.add({
        group: 'charts',
        tag: 'rechart',
        name: 'radar',
        id: 'charts_recharts_radar',
        templateName: "Radar Chart",

        defaults: {
            width: 4,
            height: 8,
            name: "Radar Chart",
            icon: "chart-network",
            description: "Displays a radar chart using Recharts",
            type: 'value',
            html: `
reactCard(\`
  function Widget() {
    const aspect = useCardAspectRatio('\${data.domId}')
    return (
      <View className="no-drag">
        <RadarChart
          colors={["#8884d8", "#82ca9d"]}
          id={"radarchart"}
          data={data.value}
          dataKey={data.params.dataKey}
          nameKey={data.params.nameKey}
          isAnimationActive={false}
          aspect={aspect}
          colors={chartColors}
        />
      </View>
    );
  }
\`, data.domId)
    `,
            params: {
                nameKey: 'stat',
                dataKey: 'value'
            },
            rulesCode: ``
        },
        emitEvent: true,
        token: getServiceToken()
    });

    context.cards.add({
        group: 'charts',
        tag: 'rechart',
        name: 'radialbar',
        id: 'charts_recharts_radialbar',
        templateName: "Radial Bar Chart",

        defaults: {
            width: 4,
            height: 8,
            name: "Radial Bar Chart",
            icon: "radar", // o "gauge", "compass" o algo visual tipo métrica
            description: "Displays a radial bar chart using Recharts",
            type: 'value',
            html: `

reactCard(\`
  function Widget() {
    const aspect = useCardAspectRatio('\${data.domId}')
    return (
      <View className="no-drag">
        <RadialBarChart
          colors={chartColors}
          title={"Progress per category"}
          id={"radialbarchart"}
          data={data.value}
          dataKey={data.params.dataKey}
          nameKey={data.params.nameKey}
          isAnimationActive={false}
          startAngle={data.params.startAngle}
          endAngle={data.params.endAngle}
          displayLegend={data.params.displayLegend}
          aspect={aspect}
        />
      </View>
    );
  }
\`, data.domId)
    
    `,
            params: {
                nameKey: 'name',
                dataKey: 'value',
                displayLegend: 'true',
                displayTooltip: 'true',
                startAngle: '90',
                endAngle: '-270',
                aspect: '1.7',
                innerRadius: '50%',
                outerRadius: '100%'
            },
            rulesCode: ``
        },
        emitEvent: true,
        token: getServiceToken()
    });


    context.cards.add({
        group: 'charts',
        tag: 'rechart',
        name: 'line',
        id: 'charts_recharts_line',
        templateName: "Line Chart",

        defaults: {
            width: 4,
            height: 8,
            name: "Line Chart",
            icon: "chart-line",
            description: "Displays a line chart using Recharts",
            type: 'value',
            html: `
reactCard(\`
  function Widget() {
    const aspect = useCardAspectRatio('\${data.domId}')
    return (
      <View className="no-drag">
        <LineChart
          colors={chartColors}
          title={"players score"}
          id={"linechart"}
          data={data.value}
          dataKey={data.params.dataKey}
          nameKey={data.params.nameKey}
          isAnimationActive={false}
          aspect={aspect}
        />
      </View>
    );
  }
\`, data.domId)
        `,
            params: {
                nameKey: 'name',
                dataKey: 'value'
            },
            rulesCode: ``
        },
        emitEvent: true,
        token: getServiceToken()
    });
}