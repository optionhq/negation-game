import items from "../data";


export default function HistoricalClaims({ claimsIds }: { claimsIds: string[] }) {
    function findElement(id: string) {
      if (!id) return items;
      let item: any;
  
      const traverse = (_items: any) => {
        for (const _item of _items) {
          if (_item.id === id) {
            item = _item;
          } else if (_item.children && _item.children.length) {
            traverse(_item.children);
          }
        }
      };
  
      traverse(items);
      return item;
    }
  
    return (
      <div className="flex flex-col w-full h-fit text-gray-500 mb-4 ">
        {claimsIds.map((e,i) => (
          <div key={i} className="relative justify-between items-center gap-4 font-medium cursor-pointer list-none border border-grey-100 -mt-3 bg-white px-5 py-4 rounded-md">{findElement(e).title}</div>
        ))}
      </div>
    );
  }