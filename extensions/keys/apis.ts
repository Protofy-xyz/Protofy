import { KeyModel } from "./";
import { AutoActions } from 'protonode'
import { getServiceToken } from '@extensions/apis/coreContext';

const prefix = '/api/v1/'

const keysActions = AutoActions({
    modelName: 'key',
    pluralName: 'keys',
    modelType: KeyModel,
    prefix, //where the API for the actions will be created
    object: 'keys', //what to display to the user in the list view
    apiUrl: '/api/core/v1/keys' //the URL to the API that will be used
})

const registerCards = (app, context) => {
    context.cards.add({
        group: 'keys',
        tag: 'keys',
        name: 'pie',
        id: 'key_setter',
        templateName: "Key Setter",
        defaults: {
            width: 4,
            height: 4,
            name: "Key Setter",
            icon: "key",
            description: "Displays a key setter for a specific key or in case already set displays key is set",
            type: 'value',
            html: `
//@react
reactCard(\`
  async function validarOpenAIKey(apiKey) {
   // return true or false if the key is valid or not
    return true;
  }

  function Widget() {
    return (
          <View className="no-drag">
            <KeySetter
              nameKey={data?.configParams?.nameKey?.defaultValue}
              validate={validarOpenAIKey}
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

\`, data.domId)

            `,
            rulesCode: ``,
            params: {
              nameKey: 'The key name to set'
            },
            configParams:{
              nameKey: {
                "visible": true,
                "defaultValue": ""
              }
            }
        },

        emitEvent: true,
        token: getServiceToken()
    })
}

export default async (app, context) => {
    keysActions(app, context);

    registerCards(app, context);
}