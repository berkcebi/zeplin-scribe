import { Link } from "react-router-dom";

function Header(props: { backTo?: string; children: React.ReactNode }) {
    return (
        <header>
            {props.backTo && (
                <Link to={props.backTo}>
                    <span className="secondary">&lt;- Back</span>
                </Link>
            )}
            <p>{props.children}</p>
        </header>
    );
}

export default Header;
