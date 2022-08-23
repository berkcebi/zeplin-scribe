function Header(props: { onBack?: () => void; children: React.ReactNode }) {
    return (
        <header>
            {props.onBack && (
                <button onClick={props.onBack}>
                    <span className="secondary">&lt;- Back</span>
                </button>
            )}
            <p className="primary">{props.children}</p>
        </header>
    );
}

export default Header;
