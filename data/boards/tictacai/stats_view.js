reactCard(`
  function Widget(props) {
    console.log('react object widget: ', props.value)
    return (
      <Tinted>
        <ViewObject
          object={props.value}
          onAdd={(key, value) => execute_action('${data.name}', { action: 'set', key, value })}
          onValueEdit={(key, value) => execute_action('${data.name}', { action: 'set', key, value })}
          onKeyDelete={(key) => execute_action('${data.name}', { action: 'delete', key })}
          onKeyEdit={(oldKey, newKey) => execute_action('${data.name}', { action: 'rename', oldKey, newKey })}
          onClear={() => execute_action('${data.name}', { action: 'reset' })}
        />
      </Tinted>
    );
  }
`, data.domId, data)