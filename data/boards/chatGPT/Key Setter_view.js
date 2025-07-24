
//@react
reactCard(`
  async function validateKey(apiKey) {
   // return true or false if the key is valid or not
    return true;
  }

  function Widget() {
    return (
          <View className="no-drag">
            <KeySetter
              nameKey={data?.configParams?.nameKey?.defaultValue}
              validate={validateKey}
              onAdd={(key) => {
                // alert("add: "+key)
              }}
              onRemove={(key) => {
                // alert("remove: "+key)
              }}
            />
          </View>
    );
  }

`, data.domId)

            