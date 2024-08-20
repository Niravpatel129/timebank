import React, { useEffect, useRef } from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import styled from 'styled-components';

const FloatingPanelContainer = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

const SearchInput = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const ItemList = styled.div`
  overflow-y: auto;
  flex: 1;
  max-height: 350px;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Item = styled.div`
  background: ${(props) => (props.type === 'epic' ? '#ff7e67' : '#ffa500')};
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 12px 0;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ItemLabel = styled.span`
  font-weight: 500;
  word-break: break-word;
  flex: 1;
  margin-right: 15px;
  max-height: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  font-size: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ActionButton = styled.button`
  margin-top: 15px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const FloatingPanel = ({
  items,
  onDragStart,
  type,
  onAdd,
  onEdit,
  onDelete,
  onClose,
  searchTerm,
  setSearchTerm,
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [items]);

  return (
    <FloatingPanelContainer>
      <SearchInput
        type='text'
        placeholder={`Search ${type}s...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ItemList ref={listRef}>
        {items
          .filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((item) => (
            <Item
              key={item.id}
              draggable
              onDragStart={(event) => onDragStart(event, type, item.label)}
              type={type}
            >
              <ItemLabel title={item.label}>{item.label}</ItemLabel>
              <ButtonGroup>
                <IconButton onClick={() => onEdit(item.id)}>
                  <FiEdit2 size={20} />
                </IconButton>
                <IconButton onClick={() => onDelete(item.id)}>
                  <FiTrash2 size={20} />
                </IconButton>
              </ButtonGroup>
            </Item>
          ))}
      </ItemList>
      <ActionButton onClick={onAdd}>
        <FiPlus size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Add {type}
      </ActionButton>
      <ActionButton onClick={onClose} style={{ backgroundColor: '#6c757d', marginTop: '10px' }}>
        <FiX size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Close
      </ActionButton>
    </FloatingPanelContainer>
  );
};

export default FloatingPanel;
