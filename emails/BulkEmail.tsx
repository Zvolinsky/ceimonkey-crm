import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Text,
    Hr,
    Tailwind,
} from '@react-email/components'

interface Props {
    subject: string
    message: string
    recipientName: string
}

export function BulkEmail({ subject, message, recipientName }: Props) {
    return (
        <Html lang="pl">
            <Head />
            <Preview>{subject}</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="mx-auto py-8 px-4 max-w-xl">
                        <Text className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {message}
                        </Text>
                        <Hr className="my-6 border-gray-200" />
                        <Text className="text-xs text-gray-400">
                            Ta wiadomość została wysłana do: {recipientName}
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}