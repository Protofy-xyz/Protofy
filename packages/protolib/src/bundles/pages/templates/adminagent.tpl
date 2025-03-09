import { Protofy } from 'protobase'
import { SSR } from 'protolib/lib/SSR';
import { AdminPage } from 'protolib/components/AdminPage'
import { DashboardGrid } from 'protolib/components/DashboardGrid';
import { withSession } from 'protolib/lib/Session';
import { XStack, YStack } from '@my/ui';
import { Tag, ArrowDownCircle, Lock, Lightbulb, Fan, Cog, GaugeCircle, Unlock, Paintbrush, ArrowRight, PowerOff, MoveUpLeft, ArrowLeft } from '@tamagui/lucide-icons';
import { computeLayout } from 'protolib/bundles/autopilot/layout';
import { useAutopilotAgent } from 'protolib/lib/useAutopilotAgent';

const isProtected = Protofy("protected", true)
Protofy("pageType", "admin")

const agentName = "{{agentName}}"
const FallbackIcon = Tag
const confTable = {
    //example of customization of a state
    //"blue-button": { icon: ArrowDownCircle, color: "$blue8" },
    //example of customization of an action
    //"{{agentName}}/exampleaction": { text: "Custom text", tint: "purple", icon: ArrowLeft },
};

const doubleWidgets = ['rules'];
const keysToExclude = ["{{agentName}}/skip", "{{agentName}}/autopilot/add_rule", "{{agentName}}/autopilot/remove_rule", "autopilot", "{{agentName}}/autopilot/on", "{{agentName}}/autopilot/off"];
const order = ["rules"]

const AgentPanel = ({ agentName }) => {
    const [widgets] = useAutopilotAgent(agentName, confTable, FallbackIcon);

    //if the key is not in the order array, it will be pushed to the end
    const items = widgets.filter(widget => !keysToExclude.includes(widget.key)).sort((a, b) => order.indexOf(b.key) - order.indexOf(a.key));

    const layouts =  {
        lg: computeLayout(items, { totalCols: 12, normalW: 2, normalH: 6, doubleW: 6, doubleH: 12}, { doubleWidgets }),
        md: computeLayout(items, { totalCols: 10, normalW: 5, normalH: 6, doubleW: 10, doubleH: 12}, { doubleWidgets }),
        sm: computeLayout(items, { totalCols: 12, normalW: 12, normalH: 6, doubleW: 12, doubleH: 12}, { doubleWidgets })
    }

    //uncomment to hardcode positions and sizes
    //layouts['lg'] = [
    //    {"i":"rules","x":0,"y":6,"w":6,"h":12,"isResizable":true},
    //];

    return <YStack flex={1} padding={20}>
        <DashboardGrid items={items} layouts={layouts} borderRadius={10} padding={10} backgroundColor="white" />
    </YStack>
}

export default {
    route: Protofy("route", "{{route}}"),
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
        return (<AdminPage title="{{name}}" pageSession={pageSession}>
            <XStack flex={1} overflow="scroll">
                <AgentPanel agentName={agentName} />
            </XStack>
        </AdminPage>)
    },
    getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined))
}