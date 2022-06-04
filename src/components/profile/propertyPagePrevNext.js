import PropTypes from "prop-types";
import {
  Button1,
  ButtonWrapper,
  LoadingButton,
  PrevStepButton,
} from "../common/Components";

export default function PropertyPagePrevNext({
  resetError,
  paging,
  setPaging,
  loading,
  action,
}) {
  return (
    <ButtonWrapper>
      {paging > 1 && paging <= 4 && (
        <PrevStepButton
          onClick={() => {
            if (paging === 1) return;
            resetError();
            setPaging(paging - 1);
          }}
        >
          上一步
        </PrevStepButton>
      )}
      {paging < 4 &&
        (loading ? (
          <LoadingButton>...</LoadingButton>
        ) : (
          <Button1
            onClick={() => {
              if (paging === 4) return;
              resetError();
              setPaging(paging + 1);
            }}
          >
            下一步
          </Button1>
        ))}
      {paging === 4 && <Button1 onClick={action}>儲存</Button1>}
    </ButtonWrapper>
  );
}

PropertyPagePrevNext.propTypes = {
  resetError: PropTypes.func.isRequired,
  paging: PropTypes.number.isRequired,
  setPaging: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired,
};
