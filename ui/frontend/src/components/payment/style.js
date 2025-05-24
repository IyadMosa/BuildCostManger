import styled from "styled-components";

export const Card = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  transition: box-shadow 0.2s ease-in-out;
  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  }
`;

export const CardContent = styled.div`
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin: 1rem 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Th = styled.th`
  background: #f9fafb;
  color: #374151;
  padding: 12px;
  border: 1px solid #e5e7eb;
  text-align: center;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 10px;
  border: 1px solid #e5e7eb;
  vertical-align: top;
  min-width: 180px;
  text-align: left;
`;
