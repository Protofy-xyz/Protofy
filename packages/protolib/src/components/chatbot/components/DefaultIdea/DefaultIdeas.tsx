import DefaultIdea from "./DefaultIdea";

const defaultIdeas = [
  {
    idea: "Create a new Object",
    moreContext: "Use the visual form to define a new data entity, like 'Product' or 'Customer'",
  },
  {
    idea: "Edit an API",
    moreContext: "Modify an existing API or create a new automation using the visual editor",
  },
  {
    idea: "Manage IoT devices",
    moreContext: "View and control your IoT devices connected through ESP32",
  },
  {
    idea: "Design a new page",
    moreContext: "Create a new page for your app using the visual-ui editor",
  },
  {
    idea: "View system events",
    moreContext: "Check out the system events viewer to monitor events in real-time",
  },
  {
    idea: "Explore user management",
    moreContext: "Manage user accounts, reset passwords, and configure user groups",
  },
  {
    idea: "Monitor database",
    moreContext: "View and edit application-level databases directly from the dev panel",
  },
  {
    idea: "Customize dashboard",
    moreContext: "Customize the dashboard to better fit your workflow in the dev panel",
  }
];

export default function DefaultIdeas({ visible = true }) {
  return (
    <div className={`row1 ${visible ? "block" : "hidden"}`}>
      <DefaultIdea ideas={defaultIdeas.slice(0, 2)} />
      <DefaultIdea
        ideas={defaultIdeas.slice(2, 4)}
        myclassNames="hidden md:visible"
      />
    </div>
  );
}
