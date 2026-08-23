import { getHelpTopic } from '../../../../../src/content/adminHelp'
import HelpTopicView from '../HelpTopicView'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const resolved = await params
  const topic = getHelpTopic(resolved?.topic)
  return {
    title: topic ? `Ajuda — ${topic.title}` : 'Ajuda',
  }
}

export default async function AdminHelpTopicPage({ params }) {
  const resolved = await params
  return <HelpTopicView topicId={resolved?.topic} />
}
