import { useEffect } from "react";
import PropTypes from "prop-types";
import scrollToTop from "../utils/scroll";

export default function useInfiniteScroll({
  firstRender,
  dispatch,
  filterData,
  anchor,
  dependency,
}) {
  return useEffect(() => {
    scrollToTop();
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.intersectionRatio <= 0) return;
      if (firstRender.current) return;

      dispatch({ type: "updateCurrentPage", payload: 1 });
      if (filterData.currentPage > filterData.allPages) return;
    });

    intersectionObserver.observe(anchor.current);
    return () => intersectionObserver.disconnect();
  }, [dependency]);
}

useInfiniteScroll.propTypes = {
  firstRender: PropTypes.shape({ current: PropTypes.bool }).isRequired,
  dispatch: PropTypes.func.isRequired,
  filterData: PropTypes.object.isRequired,
  anchor: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  dependency: PropTypes.any,
};
