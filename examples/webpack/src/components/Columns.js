import styled from "styled-components";

export const ColumnLeft = styled.div`
	flex: 1;
	@media (min-width: 768px) {
		padding-left: 10px;
	}
`;

export const ColumnRight = styled.div`
	flex: 1;
	@media (min-width: 768px) {
		padding-left: 10px;
		padding-right: 10px;
	}
`;

export const Columns = styled.div`
	@media (min-width: ${ props => props.minWidth }) {
		display: flex;
		align-content: space-between;
	}
`;

