import { useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

type Props = {
	setLoading: (isloading: boolean) => void
}

export default function LogoutLink(props: Props) {
	let history = useHistory();

	function handleClick() {
		props.setLoading(true);
		AuthService.logout()
			.then(() => history.push("/"))
			.catch(error => console.log(error))
			.finally(() => props.setLoading(false));
	}

	return (
		<span
			onClick={handleClick}
			className="nav-link"
			style={{ cursor: "pointer" }}
		>
			logout
		</span>
	);
}