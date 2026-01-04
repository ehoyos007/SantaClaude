import { useProjects } from './context/ProjectContext'
import Layout from './components/Layout'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'

function App() {
  const { state } = useProjects()

  return (
    <Layout>
      {state.view === 'list' ? (
        <ProjectList />
      ) : (
        <ProjectDetail />
      )}
    </Layout>
  )
}

export default App
