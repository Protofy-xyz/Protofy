import { useNode } from "@craftjs/core";
import { getStyleConfs, getPropConfs } from "visualui/components/conf";

const GenericSettings = () => {
  useNode((node) => node);
  let {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      {getPropConfs(props, setProp)}
      {getStyleConfs(props, setProp)}
    </div>
  );
};

export default {};
