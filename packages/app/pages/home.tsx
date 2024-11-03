import React, { useState } from "react";
import { Theme } from "@my/ui";
import { Page } from "protolib/components/Page";
import { Text } from "protolib/components/Text";
import { Pressable } from "protolib/components/Pressable";
import { Icon } from "protolib/components/Icon";
import VStack from "protolib/components/VStack";
import HStack from "protolib/components/HStack";
import Image from "protolib/components/Image";
import { useComposedState } from "protolib/lib/useComposedState";
import { withSession } from "protolib/lib/Session";
import { useEditor } from "protolib/visualui/useEdit";
import { SSR } from "protolib/lib/SSR";
import { UIWrapLib, UIWrap } from "protolib/visualui/visualuiWrapper";
import { DefaultLayout } from "../layout/DefaultLayout";
import { Protofy } from "protobase";
import { context } from "../bundles/uiContext";
import { useRouter } from "solito/navigation";
import { Objects } from "../bundles/objects";
import dynamic from 'next/dynamic';

const isProtected = Protofy("protected", false);

const Home = ({ currentView, setCurrentView, props }: any) => {
  const { cs, states } = useComposedState();
  const router = useRouter();
  context.onRender(async () => { });
  const AssistantChat = dynamic(() => import('../components/asistants/assistant-chat'));
  return (
    <Page height="99vh">
      <DefaultLayout footer={<></>}>
        <VStack height="100%" alignItems="center" padding="$10">
          <AssistantChat />
        </VStack>
      </DefaultLayout>
    </Page>
  );
};

const cw = UIWrapLib("@my/ui");

export default {
  route: Protofy("route", "/"),
  component: (props) => {
    const [currentView, setCurrentView] = useState("default");

    return useEditor(<Home currentView={currentView} setCurrentView={setCurrentView} {...props} />, {
      path: "/packages/app/pages/home.tsx",
      components: {
        ...UIWrap("DefaultLayout", DefaultLayout, "../../../layout/DefaultLayout"),
        ...cw("Theme", Theme),
      },
      context: {
        currentView: currentView,
        setCurrentView: setCurrentView,
        Objects: Objects,
      },
    });
  },
  getServerSideProps: SSR(async (context) => withSession(context, isProtected ? Protofy("permissions", []) : undefined)),
};

