import { setShowSettings } from "../../store/slices/app"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
import toast from "react-hot-toast"

import "./settings-form.scss"

const SettingsForm = () => {
    const [activityTimeout, setActivityTimeout] = useState(0)
    const [dataSendInterval, setDataSendInterval] = useState(0)
    const dispatch = useAppDispatch()
    const { showSettings } = useAppSelector(state => state.app)

    useEffect(() => {
        chrome.storage.sync.get(['activityTimeout', 'sendInterval'], (items) => {
          setActivityTimeout(items.activityTimeout || 5)
          setDataSendInterval(items.sendInterval || 1)
        });
      }, [])

    const handleClose = () => {
        dispatch(setShowSettings(false))
    }

    const onSave = async() => {
        await chrome.storage.sync.set({ activityTimeout, sendInterval: dataSendInterval })
        toast.success("Saved Changes")
    }
    
    const onDownload = async() => {
        const { jsonData } = await chrome.storage.local.get(['jsonData'])
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
    
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="settings-form-wrapper" style={{
            height: showSettings ? `450px`: '0px',
            ...(showSettings ? {}: { border: "none" })
        }}>
            <div className="settings-form-wrapper-header-wrapper">
                <div />
                <div className="settings-form-wrapper-header-wrapper-text-wrapper">
                    <img src={chrome.runtime.getURL("../../../public/icon16.png")} />
                    <div className="settings-form-wrapper-header-wrapper-text">
                        Duck Prolog Settings
                    </div>
                </div>
                <div 
                    className="settings-form-wrapper-header-wrapper-close-btn"
                    onClick={handleClose}
                >
                    <IoMdClose />
                </div>
            </div>
            <div className="settings-form-wrapper-form">
                <div className="settings-form-wrapper-form-input-wrapper">
                    <div className="settings-form-wrapper-form-input-wrapper-label">
                        Activity Timeout (seconds):
                    </div>
                    <input 
                        value={activityTimeout} 
                        onChange={e => setActivityTimeout(e.currentTarget.valueAsNumber)} 
                        type="number" 
                        id="activityTimeout" 
                        className="settings-form-wrapper-form-input-wrapper-input"
                    />
                </div>
                <div className="settings-form-wrapper-form-input-wrapper">
                    <div className="settings-form-wrapper-form-input-wrapper-label">
                        Data Send Interval (seconds):
                    </div>
                    <input 
                        value={dataSendInterval} 
                        onChange={e => setDataSendInterval(e.currentTarget.valueAsNumber)} 
                        type="number" 
                        id="sendInterval"
                        className="settings-form-wrapper-form-input-wrapper-input"
                    />
                </div>
                <div className="settings-form-wrapper-form-btn-wrapper">
                    <button
                        className="settings-form-wrapper-form-btn-wrapper-btn"
                        onClick={onSave}
                    >
                        Save Settings
                    </button>
                    <button
                        className="settings-form-wrapper-form-btn-wrapper-btn"
                        onClick={onDownload}
                    >
                        Download Data as JSON
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsForm
