import {makeStyles} from "@material-ui/core/styles";

const useStylesCard = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '100% ',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    }
}));

export default useStylesCard;