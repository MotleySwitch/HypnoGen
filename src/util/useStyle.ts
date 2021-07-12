import { makeStyles } from "@material-ui/core"

const useStyle = makeStyles((props: React.CSSProperties) => ({
	root: { ...props }
}), { name: "Style" })

export default useStyle
