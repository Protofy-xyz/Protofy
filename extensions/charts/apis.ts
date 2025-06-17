
import {AutoActions, getServiceToken} from 'protonode'

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
    return (
          <View className="no-drag">
            <PieChart
              colors={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#FF007F", "#7B00FF", "#00FF7F", "#FF4500", "#4682B4"]}
              title={"players score"}
              id={"algo_random"}
              data={data.value}
              dataKey="score"
              nameKey="name"
              isAnimationActive={false}
            />
          </View>
    );
  }

\`, data.domId)

            `,
            rulesCode: ``
        },
        emitEvent: true,
        token: getServiceToken()
    })
}