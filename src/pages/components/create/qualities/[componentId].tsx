import { useRouter } from 'next/router';

export default function CreateQualityPage() {
    const router = useRouter();
    const { componentId } = router.query;
    return <>{componentId}</>;
}
