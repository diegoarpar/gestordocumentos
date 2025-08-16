import {styled(} from "@mui/material/styles";

const useStylesCard = styled((theme) => ({
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