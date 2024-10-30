import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { setShowSettings } from "../../store/slices/app"

import "./duck-menu-icon.scss"

const DuckMenuIcon = () => {
    const { showSettings } = useAppSelector(state => state.app)
    const dispatch = useAppDispatch()

    const handleClick = () => {
        dispatch(setShowSettings(!showSettings))
    }

    return (
        <div onClick={handleClick} className="duck-menu-icon-wrapper">
            <img width="100%" src={chrome.runtime.getURL("../../../public/icon128.png")} />
        </div>
    )
}

export default DuckMenuIcon
