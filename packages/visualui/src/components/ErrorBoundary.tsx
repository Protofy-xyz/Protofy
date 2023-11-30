import { Component } from 'react';
import { Stack, Text, YStack } from "@my/ui"

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error };
    }

    componentDidCatch(error, errorInfo) {
        // Register error here or send to error service
    }

    render() {
        if (this.state['hasError']) {
            return <Stack style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <YStack width={"80%"} maxWidth={'600px'} alignItems="center">
                    <Text>
                        Can not render Visual UI frame due the following error:
                    </Text>
                    <Text color='red' marginTop='10px'>
                        {this.state['error']?.message}
                    </Text>
                </YStack>
            </Stack>
        }

        return this.props['children'];
    }
}

export default ErrorBoundary;