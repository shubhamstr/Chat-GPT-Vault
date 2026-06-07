
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
    const handleClear = () => {
        onChange("");
    };

    return (
        <div className="search-container">
            <div className="search-wrapper">
                <svg
                    className="search-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {value && (
                    <button className="search-clear-btn" onClick={handleClear} title="Clear search">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
