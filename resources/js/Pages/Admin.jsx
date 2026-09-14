import PosturIAAdmin from '../PosturIA_Admin';

export default function Admin({ role, medicoId }) {
  return <PosturIAAdmin role={role} medicoId={medicoId} />;
}
