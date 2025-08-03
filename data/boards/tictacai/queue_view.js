//@card/react
function Widget(props) {
  return (
      <Tinted>
          <ViewList 
            items={props.value} 
            onClear={(items) => execute_action(props.name, {action: 'clear'})}
            onPush={(item) => execute_action(props.name, {action: 'push', item})}
            onDeleteItem={(item, index) => execute_action(props.name, {action: 'remove', index})} 
          />
      </Tinted>
  );
}
