import ReactButtonWrapper from '../../ReactButtonWrapper';
import NegateLikeButtons from './NegateLikeButtons';
import { usePointContext } from '../../../contexts/PointContext';


export default function MobileScore({ type }: {
    type: "relevance" | "conviction";
}) {
    const { likes } = usePointContext()
  
    if(!likes) return <></>
    return (
        <div
            onClick={(e) => {
                // Only stop propagation and prevent default if the target is this div
                if (e.target !== e.currentTarget) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }}
        >
            <ReactButtonWrapper>
                <div className="flex flex-col items-center w-fit gap-[2px]">
                    <div className="flex flex-row items-center gap-1">
                        <span>{likes[type]}</span>
                        <p className='text-sm font-thin'>{type[0].toUpperCase() + type.slice(1)}</p>
                    </div>
                    <hr className="w-full h-[1.5px] bg-slate-300" />
                    <NegateLikeButtons type={type} />
                </div>
            </ReactButtonWrapper>
        </div>
    )
}

