import AutomationPage, {serverExecuted} from './page'

export default {
    'admin/automation': {component: AutomationPage, getServerSideProps: serverExecuted},
}