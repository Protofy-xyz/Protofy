import { UserModel } from ".";
import {AutoActions} from 'protonode'

const prefix = '/api/v1/'

export default AutoActions({
    modelName: 'user',
    pluralName: 'users',
    modelType: UserModel,
    prefix, //where the API for the actions will be created
    object: 'users', //what to display to the user in the list view
    apiUrl: '/api/core/v1/accounts', //the URL to the API that will be used
    notificationsName: 'accounts',
    html: {
        "list": `
//@react
const groups = getStorage('group', 'lastEntries', [])

reactCard(\`
  function Widget() {
    return (
      <View className="no-drag">
        <MqttWrapper>
          <UsersView all="filtered" groups={{data:{items:groups}}} itemData={undefined} />
        </MqttWrapper>
      </View>
    );
  }

\`, data.domId)
`,
    }
})