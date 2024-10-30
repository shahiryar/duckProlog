import DuckMenuIcon from "./components/DuckMenuIcon/DuckMenuIcon"
import EventManger from "./components/EventManager"
import SettingsForm from "./components/SettingsForm/SettingsForm"

const App = () => {
    return (
        <>
            <DuckMenuIcon />
            <SettingsForm />
            <EventManger />
        </>
    )
}

export default App