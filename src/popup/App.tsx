export default function App() {
    return (
        <div
            style={{
                width: "300px",
                padding: "16px",
                background: "white",
                color: "black",
            }}
        >
            <h1>ChatGPT Workspace</h1>

            <button
                onClick={() => {
                    alert("Working!");
                }}
            >
                Test Button
            </button>
        </div>
    );
}