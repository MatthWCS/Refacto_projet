import { useState } from "react"

/**
 * tabs: [{ key: "inventory", label: "Inventaire", content: <... /> }, ...]
 */
export const Tabs = ({ tabs, defaultActiveKey }) => {
    const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.key)

    const activeTab = tabs.find((tab) => tab.key === activeKey)

    return (
        <div>
            <div role="tablist" className="tabs tabs-lift">
                {tabs.map((tab) => (
                    <a
                        key={tab.key}
                        role="tab"
                        className={`tab ${activeKey === tab.key ? "tab-active" : ""}`}
                        onClick={() => setActiveKey(tab.key)}
                    >
                        {tab.label}
                    </a>
                ))}
            </div>
            <div className="p-4">{activeTab?.content}</div>
        </div>
    )
}
