import {Button, Drawer} from "antd";
import UseEntityDrawerModel, {EditableVideo} from "@/components/EntityDrawer/model";
import {useEffect} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import styles from './style.less'

const EntityDrawer = ({id, open, onClose}: { id?: number, open: boolean, onClose: () => void }) => {
  const model = UseEntityDrawerModel()
  useEffect(() => {
    if (id) {
      model.loadData({id})
    }
  }, [id])
  const reorder = (list:EditableVideo[], startIndex:number, endIndex:number):EditableVideo[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result:any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      model.editableVideoList,
      result.source.index,
      result.destination.index
    );
    // reassign if has new order
    // items.forEach((item,index)=>{
    //   if (item.order != index){
    //     item.newOrder = index
    //   }
    // })
    model.setEditableVideoList(items)
  }
  return (
    <Drawer open={open} title={model.getEntityName()} onClose={onClose}>
      <div>
        <div className={styles.sectionHeader}>
          <div className={styles.headerTitle}>EP</div>
          <Button> save </Button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {model.editableVideoList.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className={styles.epItem}>
                          {item.name}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Drawer>
  )
}

export default EntityDrawer
