import { Hash } from 'viem';

type BaseSigner = {
    signer_uuid: string;
    public_key: Hash;
    is_authenticated: boolean
    fid: number;
};
type GeneratedSigner = BaseSigner & {
    status: 'generated';
};
type PendingSigner = BaseSigner & {
    status: 'pending_approval';
    signer_approval_url: string;
};
type ApprovedSigner = BaseSigner & {
    status: 'approved';
    fid: number;
};
type RevokedSigner = BaseSigner & {
    status: 'revoked';
};

export type Signer = GeneratedSigner | PendingSigner | ApprovedSigner | RevokedSigner;